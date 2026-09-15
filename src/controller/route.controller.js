

const Route = require("../models/Route");

const getAllRoutes = async (req, res) => {
    const routes = await Route.find();
    res.json(routes);
};

const addRoute = async (req , res) => {

    const newRoute = await Route.create({
        routeNo: "AC-5",
        stops:  [ 
            "Garia",
            "Baghajatin",
            "Jadavpur",
            "Golpark",
            "Hazra",
            "Howrah"
        ]
    });

    res.json(newRoute);
}

const findDirectRoute = (bus, source, destination) => {
    const stops = bus.stops.map(stop => stop.toLowerCase().trim());

    const sourceIndex = stops.indexOf(source);
    const destinationIndex = stops.indexOf(destination);

    if (
        sourceIndex !== -1 &&
        destinationIndex !== -1 &&
        sourceIndex < destinationIndex
    ) {
        return {
            sourceIndex,
            destinationIndex
        };
    }

    return null;
};
const  searchRoute = async(req, res) => {
    console.log("searchroute called");
    const source = req.body.source.trim().toLowerCase();
    const destination = req.body.destination.trim().toLowerCase();
    console.log("Source received:", source);
    console.log("Destination received:", destination);

    if (!source || !destination) {
        return res.status(400).json({
            message: "Source and destination are required"
        });
    }
    const routes = await Route.find();
    console.log(routes);
    const result = routes.filter(bus => {
    return findDirectRoute(bus, source, destination);
});
    const simplifiedResult = result.map(bus => {

        const stops = bus.stops.map(stop => stop.toLowerCase());
        const sourceIndex = stops.indexOf(source.trim().toLowerCase());

        const destinationIndex = stops.indexOf(destination.trim().toLowerCase());

        const stopsBetween = bus.stops.slice(
            sourceIndex+1,
            destinationIndex 
        );
        return {
            routeNo: bus.routeNo,
            stopsBetween : stopsBetween
        };
    });

    console.log("STOPS BETWEEN:", simplifiedResult[0]?.stopsBetween);
    console.log("Final result:", simplifiedResult);
    if (simplifiedResult.length === 0) {
        console.log("No routes found");
        return res.status(404).json({
            message: "No routes found"
        });
    }

    res.json(simplifiedResult);
};

const getRouteByNumber = async (req, res) => {
    const routeNo = req.params.routeNo;

    const bus = await Route.findOne({ routeNo });

    if (!bus) {
        return res.status(404).json({
            message: "Route not found"
        });
    }

    res.json(bus);
};
const getAllStops = async (req, res) => {
    const routes = await Route.find();

    const stops = [];

    routes.forEach(bus => {
        bus.stops.forEach(stop => {
            if (!stops.includes(stop)) {
                stops.push(stop);
            }
        });
    });

    res.json(stops);
};

module.exports = {
    getAllRoutes,
    searchRoute,
    getRouteByNumber,
    getAllStops,
    addRoute
};