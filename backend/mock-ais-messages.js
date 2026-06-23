export const mockAisMessages = [
    {
        MessageType: 'PositionReport',
        Message: {
            PositionReport: {
                UserID: 314153000,
                Latitude: 51.07429,
                Longitude: 1.52129,
                Sog: 13.2,
                Cog: 221.6,
                TrueHeading: 223,
                Timestamp: 40,
            },
        },
        MetaData: {
            MMSI: 314153000,
            ShipName: 'AEQUORA FORTUNE',
            latitude: 51.07430,
            longitude: 1.52129,
            time_utc: '2026-06-17 23:49:44.227345498 +0000 UTC',
        },
    },
    {
        MessageType: 'ShipStaticData',
        Message: {
            ShipStaticData: {
                UserID: 228041600,
                Name: 'PIERRE DE FERMAT',
                ImoNumber: 9694505,
                CallSign: 'FIIZ',
                Type: 90,
                MaximumStaticDraught: 5.6,
                Dimension: { A: 55, B: 15, C: 8, D: 7 },
            },
        },
        MetaData: {
            MMSI: 228041600,
            ShipName: 'PIERRE DE FERMAT',
            latitude: 50.96908,
            longitude: 1.86405,
            time_utc: '2026-06-17 23:50:27.175370320 +0000 UTC',
        },
    },
    {
        MessageType: 'PositionReport',
        Message: {
            PositionReport: {
                UserID: 310594000,
                Latitude: 51.01563,
                Longitude: 1.61291,
                Sog: 14.3,
                Cog: 45.5,
                TrueHeading: 45,
                Timestamp: 13,
            },
        },
        MetaData: {
            MMSI: 310594000,
            ShipName: 'GASLOG SINGAPORE',
            latitude: 51.01563,
            longitude: 1.61291,
            time_utc: '2026-06-17 23:50:21.679633339 +0000 UTC',
        },
    },
    {
        MessageType: 'ShipStaticData',
        Message: {
            ShipStaticData: {
                UserID: 314153000,
                Name: 'AEQUORA FORTUNE',
                ImoNumber: 9388729,
                CallSign: 'C6DQ4',
                Type: 70,
                MaximumStaticDraught: 7.2,
                Dimension: { A: 140, B: 30, C: 12, D: 10 },
            },
        },
        MetaData: {
            MMSI: 314153000,
            ShipName: 'AEQUORA FORTUNE',
            latitude: 51.07430,
            longitude: 1.52129,
            time_utc: '2026-06-17 23:52:00.000000000 +0000 UTC',
        },
    },
    {
        MessageType: 'PositionReport',
        Message: {
            PositionReport: {
                UserID: 210385000,
                Latitude: 50.96634,
                Longitude: 1.70068,
                Sog: 18.7,
                Cog: 102.5,
                TrueHeading: 110,
                Timestamp: 59,
            },
        },
        MetaData: {
            MMSI: 210385000,
            ShipName: 'P&O PIONEER',
            latitude: 50.96634,
            longitude: 1.70068,
            time_utc: '2026-06-17 23:50:04.638479798 +0000 UTC',
        },
    },
    {
        MessageType: 'ShipStaticData',
        Message: {
            ShipStaticData: {
                UserID: 310594000,
                Name: 'GASLOG SINGAPORE',
                ImoNumber: 9758900,
                CallSign: 'ZCFD5',
                Type: 80,
                MaximumStaticDraught: 11.4,
                Dimension: { A: 180, B: 45, C: 16, D: 14 },
            },
        },
        MetaData: {
            MMSI: 310594000,
            ShipName: 'GASLOG SINGAPORE',
            latitude: 51.01563,
            longitude: 1.61291,
            time_utc: '2026-06-17 23:56:00.000000000 +0000 UTC',
        },
    },
];

