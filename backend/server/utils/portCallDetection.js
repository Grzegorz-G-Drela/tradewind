import { getDistanceKm } from "./distance.js";

function checkIfDocked(vessel, ports, thresholdKm = 2) {
    for (const port of ports) {
        const distance = getDistanceKm(vessel.lat, vessel.lon, port.lat, port.lon);
        if (distance <= thresholdKm && vessel.speed < 1) {
            return port; // vessel docked at this port
        }
    }
    return null; // not docked
}

export { checkIfDocked };