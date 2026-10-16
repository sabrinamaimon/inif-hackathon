import networkx as nx
from typing import List, Dict, Any, Optional, Tuple
from data.dhaka_transit_data import DHAKA_HUBS, TRANSIT_ROUTES, TRANSIT_EDGES
from services.fare_engine import DhakaFareEngine
from models.schemas import RouteOption, RouteLeg

class DhakaTransitGraph:
    """
    Multi-modal graph for Dhaka city transit.
    Uses NetworkX MultiDiGraph to preserve Metro, Bus, Leguna, and Rickshaw edges.
    Supports dynamic disruption weights, detour calculations, and multi-leg generation.
    """

    def __init__(self):
        self.multi_graph = nx.MultiDiGraph()
        self.build_base_graph()

    def build_base_graph(self):
        self.multi_graph.clear()
        for hub_name, hub_data in DHAKA_HUBS.items():
            self.multi_graph.add_node(
                hub_name,
                name_bn=hub_data["name_bn"],
                lat=hub_data["lat"],
                lng=hub_data["lng"],
                is_metro=hub_data["is_metro_station"]
            )

        # 1. Add Metro Edges (MRT-6)
        mrt_stops = ["Uttara", "Mirpur 10", "Agargaon", "Farmgate", "Shahbagh", "Motijheel"]
        for i in range(len(mrt_stops) - 1):
            u, v = mrt_stops[i], mrt_stops[i+1]
            dist = self._get_edge_distance(u, v)
            # Metro is immune to street traffic/waterlogging!
            self.multi_graph.add_edge(
                u, v,
                key="metro",
                mode="metro",
                line_name="MRT-6 Metro Rail",
                distance_km=dist,
                base_time_mins=6,  # 6 mins between stations
                operator="DMTCL",
                color="#059669",
                student_allowed=False,
                elevated=True
            )
            self.multi_graph.add_edge(
                v, u,
                key="metro",
                mode="metro",
                line_name="MRT-6 Metro Rail",
                distance_km=dist,
                base_time_mins=6,
                operator="DMTCL",
                color="#059669",
                student_allowed=False,
                elevated=True
            )

        # 2. Add Bus Routes
        for route in TRANSIT_ROUTES:
            if route["type"] != "bus":
                continue
            stops = route["hubs"]
            for i in range(len(stops) - 1):
                u, v = stops[i], stops[i+1]
                dist = self._get_edge_distance(u, v)
                base_time = self._get_edge_time(u, v)
                self.multi_graph.add_edge(
                    u, v,
                    key=f"bus_{route['name']}",
                    mode="bus",
                    line_name=route["name"],
                    distance_km=dist,
                    base_time_mins=base_time,
                    operator=route["operator"],
                    color=route["color"],
                    student_allowed=True,
                    elevated=False
                )
                self.multi_graph.add_edge(
                    v, u,
                    key=f"bus_{route['name']}",
                    mode="bus",
                    line_name=route["name"],
                    distance_km=dist,
                    base_time_mins=base_time,
                    operator=route["operator"],
                    color=route["color"],
                    student_allowed=True,
                    elevated=False
                )

        # 3. Add Leguna Routes
        for route in TRANSIT_ROUTES:
            if route["type"] != "leguna":
                continue
            stops = route["hubs"]
            for i in range(len(stops) - 1):
                u, v = stops[i], stops[i+1]
                dist = self._get_edge_distance(u, v)
                base_time = max(5, int(dist * 3.5))
                self.multi_graph.add_edge(
                    u, v,
                    key=f"leguna_{route['name']}",
                    mode="leguna",
                    line_name=route["name"],
                    distance_km=dist,
                    base_time_mins=base_time,
                    operator="Leguna Co-op",
                    color=route["color"],
                    student_allowed=False,
                    elevated=False
                )
                self.multi_graph.add_edge(
                    v, u,
                    key=f"leguna_{route['name']}",
                    mode="leguna",
                    line_name=route["name"],
                    distance_km=dist,
                    base_time_mins=base_time,
                    operator="Leguna Co-op",
                    color=route["color"],
                    student_allowed=False,
                    elevated=False
                )

        # 4. Add Connector Rickshaw Edges between adjacent hubs
        for (u, v), edge_info in TRANSIT_EDGES.items():
            dist = edge_info["distance_km"]
            base_time = edge_info["base_time_mins"]
            self.multi_graph.add_edge(
                u, v,
                key="rickshaw",
                mode="rickshaw",
                line_name="Connector Rickshaw",
                distance_km=dist,
                base_time_mins=base_time,
                operator="Local Rickshaw Puller",
                color="#eab308",
                student_allowed=False,
                elevated=False
            )
            self.multi_graph.add_edge(
                v, u,
                key="rickshaw",
                mode="rickshaw",
                line_name="Connector Rickshaw",
                distance_km=dist,
                base_time_mins=base_time,
                operator="Local Rickshaw Puller",
                color="#eab308",
                student_allowed=False,
                elevated=False
            )

    def _get_edge_distance(self, u: str, v: str) -> float:
        if (u, v) in TRANSIT_EDGES:
            return TRANSIT_EDGES[(u, v)]["distance_km"]
        if (v, u) in TRANSIT_EDGES:
            return TRANSIT_EDGES[(v, u)]["distance_km"]
        return 3.0

    def _get_edge_time(self, u: str, v: str) -> int:
        if (u, v) in TRANSIT_EDGES:
            return TRANSIT_EDGES[(u, v)]["base_time_mins"]
        if (v, u) in TRANSIT_EDGES:
            return TRANSIT_EDGES[(v, u)]["base_time_mins"]
        return 12

    def find_routes(
        self,
        origin: str,
        destination: str,
        passenger_type: str = "general",
        avoid_hubs: List[str] = [],
        weather: str = "normal",
        is_rush_hour: bool = False,
        active_alerts: List[Dict[str, Any]] = []
    ) -> List[RouteOption]:
        """Generates ranked multimodal routes with disruption rerouting"""
        if origin not in DHAKA_HUBS or destination not in DHAKA_HUBS:
            return []

        # Identify blocked or disrupted hubs
        blocked_set = set(avoid_hubs)
        waterlogged_set = set()

        for alert in active_alerts:
            if not alert.get("is_active", True):
                continue
            hub = alert.get("hub")
            alert_type = alert.get("type")
            if alert_type in ["blockade", "protest"]:
                blocked_set.add(hub)
            elif alert_type == "waterlogging":
                waterlogged_set.add(hub)

        # Generate up to 3 diverse route paths
        routes: List[RouteOption] = []

        # 1. Metro / Fastest Priority
        fast_option = self._generate_path(
            origin, destination,
            priority="fastest",
            weather=weather,
            is_rush_hour=is_rush_hour,
            waterlogged_hubs=waterlogged_set,
            blocked_hubs=blocked_set
        )
        if fast_option:
            fast_option.id = "opt-fastest"
            fast_option.type_badge = "Fastest Route"
            fast_option.title = f"Express Priority ({origin} -> {destination})"
            fast_option.title_bn = f"দ্রুততম রুট ({DHAKA_HUBS[origin]['name_bn']} -> {DHAKA_HUBS[destination]['name_bn']})"
            fast_option.is_recommended = True
            routes.append(fast_option)

        # 2. Student / Cheapest Priority (Bus focus)
        bus_option = self._generate_path(
            origin, destination,
            priority="cheapest_bus",
            weather=weather,
            is_rush_hour=is_rush_hour,
            waterlogged_hubs=waterlogged_set,
            blocked_hubs=blocked_set
        )
        if bus_option:
            # Only add if distinct from fastest
            is_distinct = (
                not routes or
                bus_option.total_regular_fare != routes[0].total_regular_fare or
                bus_option.transfers != routes[0].transfers or
                [l.mode for l in bus_option.legs] != [l.mode for l in routes[0].legs]
            )
            if is_distinct:
                bus_option.id = "opt-cheapest"
                bus_option.type_badge = "Student & Budget Pick"
                bus_option.title = f"Economy Bus Route ({origin} -> {destination})"
                bus_option.title_bn = f"সাশ্রয়ী ও হাফ-পাস রুট ({DHAKA_HUBS[origin]['name_bn']} -> {DHAKA_HUBS[destination]['name_bn']})"
                routes.append(bus_option)

        # 3. Resilient Detour Route if disruptions active
        if waterlogged_set or blocked_set:
            detour_option = self._generate_path(
                origin, destination,
                priority="detour",
                weather=weather,
                is_rush_hour=is_rush_hour,
                waterlogged_hubs=waterlogged_set,
                blocked_hubs=blocked_set
            )
            if detour_option and not any(r.legs == detour_option.legs for r in routes):
                detour_option.id = "opt-detour"
                detour_option.type_badge = "Safe Detour"
                detour_option.title = "Disruption Bypass Detour"
                detour_option.title_bn = "জলজট ও ব্যারিকেড এড়িয়ে বিকল্প পথ"
                detour_option.is_detour = True
                detour_option.disruption_warning = "Bypassing waterlogged/blocked intersections automatically."
                routes.append(detour_option)

        # Fallback if no specific paths found
        if not routes:
            direct_fallback = self._generate_direct_fallback(origin, destination, weather, is_rush_hour)
            if direct_fallback:
                routes.append(direct_fallback)

        return routes

    def _generate_path(
        self,
        origin: str,
        destination: str,
        priority: str,
        weather: str,
        is_rush_hour: bool,
        waterlogged_hubs: set,
        blocked_hubs: set
    ) -> Optional[RouteOption]:
        """Projects MultiDiGraph into a weighted DiGraph for specific priority and runs shortest path"""
        g = nx.DiGraph()
        for node, data in self.multi_graph.nodes(data=True):
            g.add_node(node, **data)

        # Project multi-edges into single best edge between (u, v) based on priority
        for u, v in self.multi_graph.edges():
            edge_dict = self.multi_graph[u][v]
            best_candidate = None
            best_weight = float('inf')

            for key, data in edge_dict.items():
                mode = data.get("mode", "bus")
                elevated = data.get("elevated", False)
                base_time = data.get("base_time_mins", 10)

                # If hub is blocked:
                # Surface transport cannot pass, but elevated Metro CAN pass
                if (u in blocked_hubs or v in blocked_hubs) and not elevated:
                    continue

                weight = base_time

                # Priority adjustments
                if priority == "fastest":
                    if mode == "metro":
                        weight = base_time * 0.4  # Rapid transit highest preference
                    elif mode == "bus":
                        weight = base_time * 1.0
                    elif mode == "rickshaw":
                        weight = base_time * 1.8
                elif priority == "cheapest_bus":
                    if mode == "bus":
                        weight = base_time * 0.5  # Student half-pass bus preferred
                    elif mode == "metro":
                        weight = base_time * 1.1
                    elif mode == "rickshaw":
                        weight = base_time * 2.5
                elif priority == "detour":
                    if (u in waterlogged_hubs or v in waterlogged_hubs) and not elevated:
                        weight = base_time * 5.0  # Avoid flooded streets
                    elif elevated:
                        weight = base_time * 0.3  # Prefer elevated metro for detour

                # Penalties for weather on surface
                if not elevated:
                    if (u in waterlogged_hubs or v in waterlogged_hubs):
                        weight += 15
                    if weather in ["rain", "heavy_monsoon"]:
                        weight *= 1.4
                    if is_rush_hour:
                        weight *= 1.3

                if weight < best_weight:
                    best_weight = weight
                    best_candidate = dict(data)
                    best_candidate["calc_weight"] = weight

            if best_candidate:
                g.add_edge(u, v, **best_candidate)

        try:
            node_path = nx.shortest_path(g, source=origin, target=destination, weight="calc_weight")
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return None

        # Build RouteLeg list
        legs: List[RouteLeg] = []
        total_time = 0
        total_regular = 0
        total_student = 0
        transfers = max(0, len(node_path) - 2)

        for i in range(len(node_path) - 1):
            u = node_path[i]
            v = node_path[i+1]
            edge_data = g.get_edge_data(u, v) or {}
            mode = edge_data.get("mode", "bus")
            line_name = edge_data.get("line_name", "Transit Line")
            dist = edge_data.get("distance_km", 2.5)
            duration = edge_data.get("base_time_mins", 10)

            # Adjust duration for weather and rush hour on surface transport
            if mode != "metro":
                if weather in ["rain", "heavy_monsoon"]:
                    duration = int(duration * 1.4)
                if is_rush_hour:
                    duration = int(duration * 1.3)
                if u in waterlogged_hubs or v in waterlogged_hubs:
                    duration += 15

            # Calculate exact leg fare
            surge_mult = 1.0
            if mode == "metro":
                reg_fare = DhakaFareEngine.calculate_metro_fare(u, v)
                stud_fare = reg_fare  # Metro has no student discount
            elif mode == "bus":
                reg_fare, stud_fare = DhakaFareEngine.calculate_bus_fare(dist)
            elif mode == "leguna":
                reg_fare, stud_fare = DhakaFareEngine.calculate_leguna_fare(u, v, dist)
            else:  # rickshaw
                reg_fare, stud_fare, surge_mult = DhakaFareEngine.calculate_rickshaw_fare(
                    u, v, dist, weather=weather, is_rush_hour=is_rush_hour
                )

            instructions = self._get_landmark_instruction(u, v, mode, line_name)

            leg = RouteLeg(
                leg_number=i+1,
                mode=mode,
                line_name=line_name,
                from_hub=u,
                to_hub=v,
                distance_km=round(dist, 1),
                duration_mins=duration,
                regular_fare_bdt=reg_fare,
                student_fare_bdt=stud_fare,
                surge_multiplier=surge_mult,
                landmark_instructions=instructions,
                is_affected_by_alert=(u in waterlogged_hubs or v in waterlogged_hubs or u in blocked_hubs or v in blocked_hubs)
            )
            legs.append(leg)
            total_time += duration
            total_regular += reg_fare
            total_student += stud_fare

        return RouteOption(
            id=f"opt-{priority}",
            title=f"Route via {node_path[1] if len(node_path) > 2 else 'Direct'}",
            title_bn=f"রুট: {DHAKA_HUBS.get(node_path[1], {}).get('name_bn', '')} হয়ে",
            type_badge="Standard",
            total_duration_mins=total_time,
            total_regular_fare=total_regular,
            total_student_fare=total_student,
            transfers=transfers,
            legs=legs,
            is_recommended=False,
            is_detour=False
        )

    def _get_landmark_instruction(self, u: str, v: str, mode: str, line_name: str) -> str:
        hub_u = DHAKA_HUBS.get(u, {})
        landmarks = hub_u.get("landmarks", ["Main junction"])
        primary_landmark = landmarks[0] if landmarks else "bus stand"

        if mode == "metro":
            return f"Board MRT-6 Train from {u} Station concourse. Alight at {v} Station platform."
        elif mode == "bus":
            return f"Board {line_name} at {u} near {primary_landmark}. Ride towards {v}."
        elif mode == "leguna":
            return f"Board leguna stand at {u} ({primary_landmark}). Ask driver for {v} drop-off."
        else:
            return f"Hail connector rickshaw near {primary_landmark} at {u}. Negotiate drop-off at {v}."

    def _generate_direct_fallback(self, origin: str, destination: str, weather: str, is_rush_hour: bool) -> RouteOption:
        dist = 5.0
        reg_fare, stud_fare, surge = DhakaFareEngine.calculate_rickshaw_fare(
            origin, destination, dist, weather=weather, is_rush_hour=is_rush_hour
        )
        leg = RouteLeg(
            leg_number=1,
            mode="rickshaw",
            line_name="Direct Connector Rickshaw/CNG",
            from_hub=origin,
            to_hub=destination,
            distance_km=dist,
            duration_mins=25,
            regular_fare_bdt=reg_fare,
            student_fare_bdt=stud_fare,
            surge_multiplier=surge,
            landmark_instructions=f"Take direct connector from {origin} to {destination}."
        )
        return RouteOption(
            id="opt-fallback",
            title=f"Direct Connector ({origin} -> {destination})",
            title_bn=f"সরাসরি সংযোগ ({DHAKA_HUBS[origin]['name_bn']} -> {DHAKA_HUBS[destination]['name_bn']})",
            type_badge="Direct",
            total_duration_mins=25,
            total_regular_fare=reg_fare,
            total_student_fare=stud_fare,
            transfers=0,
            legs=[leg],
            is_recommended=True,
            is_detour=False
        )
