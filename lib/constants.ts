// Application constants

export const CATEGORIES = [
    { id: 'argumes', name: 'Argumes', description: 'Agrumes frais' },
    { id: 'corbeille', name: 'Corbeille de fruit', description: 'Corbeilles de fruits' },
    { id: 'epicerie', name: 'Épicerie Fine', description: 'Produits d\'épicerie fine' },
    { id: 'fruits-coupes', name: 'Fruits coupés', description: 'Fruits coupés frais' },
    { id: 'fruits-saison', name: 'Fruits De Saison', description: 'Fruits de saison' },
    { id: 'fruits-exotiques', name: 'Fruits exotiques', description: 'Fruits exotiques' },
    { id: 'fruits-rouges', name: 'Fruits rouges', description: 'Fruits rouges' },
    { id: 'fruits-secs', name: 'Fruits secs', description: 'Fruits secs' },
    { id: 'herbes', name: 'Herbes harmonique', description: 'Herbes aromatiques' },
    { id: 'jus', name: 'Jus De Fruits', description: 'Jus de fruits frais' },
    { id: 'legumes', name: 'Légumes', description: 'Légumes frais' },
    { id: 'produits-laitiers', name: 'Produits laitiers', description: 'Produits laitiers' },
    { id: 'salades', name: 'Salades', description: 'Salades fraîches' },
    { id: 'tomates', name: 'Tomates', description: 'Tomates fraîches' },
];

export const PICKUP_LOCATIONS = [
    {
        id: 'store-1',
        name: 'Magasin Principal',
        address: '123 Rue des Délices, 75001 Paris',
        description: 'Notre magasin principal au cœur de Paris',
    },
    {
        id: 'store-2',
        name: 'Point Relais Nord',
        address: '45 Avenue du Nord, 75018 Paris',
        description: 'Point de retrait dans le 18ème arrondissement',
    },
];

export const DELIVERY_ZONES = [
    { postalCode: '75001', available: true, fee: 5 },
    { postalCode: '75002', available: true, fee: 5 },
    { postalCode: '75003', available: true, fee: 5 },
    { postalCode: '75004', available: true, fee: 5 },
    { postalCode: '75005', available: true, fee: 5 },
    { postalCode: '75006', available: true, fee: 5 },
    { postalCode: '75007', available: true, fee: 5 },
    { postalCode: '75008', available: true, fee: 5 },
    { postalCode: '75009', available: true, fee: 5 },
    { postalCode: '75010', available: true, fee: 5 },
    { postalCode: '75011', available: true, fee: 5 },
    { postalCode: '75012', available: true, fee: 5 },
    { postalCode: '75013', available: true, fee: 5 },
    { postalCode: '75014', available: true, fee: 5 },
    { postalCode: '75015', available: true, fee: 5 },
    { postalCode: '75016', available: true, fee: 5 },
    { postalCode: '75017', available: true, fee: 5 },
    { postalCode: '75018', available: true, fee: 5 },
    { postalCode: '75019', available: true, fee: 5 },
    { postalCode: '75020', available: true, fee: 5 },
];

export const DELIVERY_FEE = 5;
export const MINIMUM_DELIVERY_AMOUNT = 30;

export const DELIVERY_TIME_SLOTS = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00',
];

export const isDeliveryZoneAvailable = (postalCode: string): boolean => {
    return DELIVERY_ZONES.some((zone) => zone.postalCode === postalCode && zone.available);
};
