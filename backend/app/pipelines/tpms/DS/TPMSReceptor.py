class TPMSReader:
    def __init__(self, name: str, latitude: float, longitude: float, location: str):
        """
        Initialize a TPMS reader node.
        
        Parameters:
            name (str): A unique name or identifier for the reader.
            latitude (float): Latitude coordinate.
            longitude (float): Longitude coordinate.
            location (str): A human-friendly location name.
        """
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.location = location
        self.readings = Readings()  # Each reader holds its own collection of readings.
    
    def add_reading(self, detection: Detection):
        """
        Add a detection reading to this TPMS reader.
        """
        self.readings.add(detection)
    
    def search_readings(self, **kwargs) -> List[Detection]:
        """
        Search the readings within this TPMS reader using provided key=value parameters.
        """
        return self.readings.search(**kwargs)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'location': self.location,
            'readings': self.readings.to_list()
        }
    
    def __repr__(self):
        return f"TPMSReader(name={self.name}, location={self.location})"


class TPMSNetwork:
    def __init__(self):
        """
        Initialize the TPMS network as a directed graph of TPMS reader nodes.
        """
        self.graph: nx.DiGraph = nx.DiGraph()
    
    def add_reader(self, reader: TPMSReader):
        """
        Add a TPMSReader node to the network.
        The reader's name is used as the node identifier.
        """
        self.graph.add_node(reader.name, reader=reader)
    
    def add_edge(self, from_reader: str, to_reader: str):
        """
        Add a directed edge from one TPMS reader node to another.
        This can be used to represent, for example, connectivity or typical travel paths.
        """
        self.graph.add_edge(from_reader, to_reader)
    
    def get_reader(self, name: str) -> Optional[TPMSReader]:
        """
        Retrieve a TPMSReader node by its name.
        """
        if name in self.graph:
            return self.graph.nodes[name].get('reader')
        return None
    
    def search_readings_in_reader(self, reader_name: str, **kwargs) -> List[Detection]:
        """
        Search for readings within a specific TPMS reader node using the allowed parameters.
        """
        reader = self.get_reader(reader_name)
        if reader:
            return reader.search_readings(**kwargs)
        return []
    
    def search_readings_across_readers(self, **kwargs) -> List[Detection]:
        """
        Search for readings across all TPMS reader nodes using the allowed parameters.
        """
        results = []
        for node, data in self.graph.nodes(data=True):
            reader: TPMSReader = data.get('reader')
            results.extend(reader.search_readings(**kwargs))
        return sorted(results, key=lambda d: d.timestamp)
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Return a dictionary representation of the network.
        """
        return {node: data['reader'].to_dict() for node, data in self.graph.nodes(data=True)}
