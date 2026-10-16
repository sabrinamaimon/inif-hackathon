import networkx as nx
from typing import List, Dict, Any, Optional, Tuple
from data.dhaka_transit_data import DHAKA_HUBS, TRANSIT_ROUTES, TRANSIT_EDGES
from services.fare_engine import DhakaFareEngine
from models.schemas import RouteOption, RouteLeg

class DhakaTransitGraph:
    """
    Multi-modal graph for Dhaka city transit.
    Supports dynamic disruption weights, detour calculations, and multi-leg generation.
    """

    def __init__(self):
        self.raw_graph = nx.DiGraph()
        self.build_base_graph()

    def build_base_graph(self):
        self.raw_graph.clear()
        for hub_name, hub_data in DHAKA_HUBS.items():
            self.raw_graph.add_node(
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
            self.raw_graph.add_edge(
                u, v,
                mode="metro",
                line_name="MRT-6 Metro Rail",
                distance_km=dist,
                base_time_mins=6,  # 6 mins between stations
                operator="DMTCL",
                color="#059669",
                student_allowed=False,
                elevated=True
            )
            self.raw_graph.add_edge(
                v, u,
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
                self.raw_graph.add_edge(
                    u, v,
                    mode="bus",
                    line_name=route["name"],
                    distance_km=dist,
                    base_time_mins=base_time,
                    operator=route["operator"],
                    color=route["color"],
                    student_allowed=True,
                    elevated=False
                )
                self.raw_graph.add_edge(
                    v, u,
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
                self.raw_graph.add_edge(
                    u, v,
                    mode="leguna",
                    line_name=route["name"],
                    distance_km=dist,
                    base_time_mins=base_time,
                    operator="Leguna Co-op",
                    color=route["color"],
                    student_allowed=False,
                    elevated=False
                )
                self.raw_graph.add_edge(
                    v, u,
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
            self.raw_graph.add_edge(
                u, v,
                mode="rickshaw",
                line_name="Connector Rickshaw",
                distance_km=dist,
                base_time_mins=base_time,
                operator="Local Rickshaw Puller",
                color="#eab308",
                student_allowed=False,
                elevated=False
            )
            self.raw_graph.add_edge(
                v, u,
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

        # Build dynamic working graph with disruption penalties
        working_graph = self.raw_graph.copy()

        # Identify blocked or disrupted hubs
        blocked_set = set(avoid_hubs)
        waterlogged_set = set()

        for alert in active_alerts:
            if not alert.get("is_active", True):
                continue
            hub = alert.get("hub")
            alert_type = alert.get("type")
            if alert_type in ["blockade", "protest"]:
                # Blockade stops surface transport (bus, rickshaw, leguna)
                # Elevated Metro Rail still runs through!
                for u, v, data in list(working_graph.edges(data=True)):
                    if (u == hub or v == hub) and not data.get("elevated", False):
                        working_graph[u][v]["weight"] = 99999
            elif alert_type == "waterlogging":
                waterlogged_set.add(hub)
                for u, v, data in list(working_graph.edges(data=True)):
                    if (u == hub or v == hub) and not data.get("elevated", False):
                        # Severe delay / penalty
                        working_graph[u][v]["weight"] = data.get("base_time_mins", 10) * 4
            elif alert_type == "gridlock":
                for u, v, data in list(working_graph.edges(data=True)):
                    if (u == hub or v == hub) and not data.get("elevated", False):
                        working_graph[u][v]["weight"] = data.get("base_time_mins", 10) * 2.5

        # Explicit avoid hubs
        for h in blocked_set:
            if h in working_graph and h not in [origin, destination]:
                for u, v in list(working_graph.edges()):
                    if u == h or v == h:
                        working_graph[u][v]["weight"] = 99999

        # Generate up to 3 diverse route paths
        routes: List[RouteOption] = []

        # 1. Metro / Fastest Priority
        fast_option = self._generate_path(
            working_graph, origin, destination,
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
            working_graph, origin, destination,
            priority="cheapest_bus",
            weather=weather,
            is_rush_hour=is_rush_hour,
            waterlogged_hubs=waterlogged_set,
            blocked_hubs=blocked_set
        )
        if bus_option and (not routes or bus_option.total_regular_fare != routes[0].total_regular_fare or bus_option.transfers != routes[0].transfers):
            bus_option.id = "opt-cheapest"
            bus_option.type_badge = "Student & Budget Pick"
            bus_option.title = f"Economy Bus Route ({origin} -> {destination})"
            bus_option.title_bn = f"সাশ্রয়ী ও হাফ-পাস রুট ({DHAKA_HUBS[origin]['name_bn']} -> {DHAKA_HUBS[destination]['name_bn']})"
            routes.append(bus_option)

        # 3. Resilient Detour Route if disruptions active
        if waterlogged_set or blocked_set:
            detour_option = self._generate_path(
                working_graph, origin, destination,
                priority="detour",
                weather=weather,
                is_rush_hour=is_rush_hour,
                waterlogged_hubs=waterlogged_set,
                blocked_hubs=blocked_set
            )
            if detour_option and not any(r.id == detour_option.id for r in routes):
                detour_option.id = "opt-detour"
                detour_option.type_badge = "Safe Detour"
                detour_option.title = f"Disruption Bypass Detour"
                detour_option.title_bn = f"জলজট ও ব্যারিকেড এড়িয়ে বিকল্প পথ"
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
        graph: nx.DiGraph,
        origin: str,
        destination: str,
        priority: str,
        weather: str,
        is_rush_hour: bool,
        waterlogged_hubs: set,
        blocked_hubs: set
    ) -> Optional[RouteOption]:
        """Finds path and computes exact multi-modal leg data"""
        try:
            # Set custom edge weights based on priority
            g = graph.copy()
            for u, v, d in g.edges(data=True):
                weight = d.get("weight", d.get("base_time_mins", 10))
                mode = d.get("mode", "bus")
                if priority == "fastest":
                    if mode == "metro":
                        weight *= 0.5  # Heavy preference for rapid transit
                    elif mode == "rickshaw":
                        weight *= 1.4
                elif priority == "cheapest_bus":
                    if mode == "bus":
                        weight *= 0.6  # Heavy preference for student discountable buses
                    elif mode == "metro":
                        weight *= 1.2
                    elif mode == "rickshaw":
                        weight *= 2.0
                elif priority == "detour":
                    if u in waterlogged_hubs or v in waterlogged_hubs or u in blocked_hubs or v in blocked_hubs:
                        weight = 99999
                g[u][v]["calc_weight"] = weight

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

            # Landmark instructions
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
