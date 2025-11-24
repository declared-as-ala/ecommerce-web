// Application constants

export const CATEGORIES = [
    { id: 'argumes', name: 'Argumes', description: 'Agrumes frais', image: 'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg' },
    { id: 'corbeille', name: 'Corbeille de fruit', description: 'Corbeilles de fruits', image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg' },
    { id: 'epicerie', name: 'Épicerie Fine', description: 'Produits d\'épicerie fine', image: 'https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg' },
    { id: 'fruits-coupes', name: 'Fruits coupés', description: 'Fruits coupés frais', image: 'https://images.pexels.com/photos/461208/pexels-photo-461208.jpeg' },
    { id: 'fruits-saison', name: 'Fruits De Saison', description: 'Fruits de saison', image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg' },
    { id: 'fruits-exotiques', name: 'Fruits exotiques', description: 'Fruits exotiques', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg' },
    { id: 'fruits-rouges', name: 'Fruits rouges', description: 'Fruits rouges', image: 'https://images.pexels.com/photos/89778/strawberries-frisch-ripe-sweet-89778.jpeg' },
    { id: 'fruits-secs', name: 'Fruits secs', description: 'Fruits secs', image: 'https://cms-cdn.lafourche.fr/c28db269-c629-4cb9-90e5-85b5d943a9d3_maksim-shutov-pUa1On18Jno-unsplash.jpg?rect=0%2C0%2C5760%2C3840&w=5760&h=3840' },
    { id: 'herbes', name: 'Herbes harmonique', description: 'Herbes aromatiques', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg' },
    { id: 'jus', name: 'Jus De Fruits', description: 'Jus de fruits frais', image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg' },
    { id: 'legumes', name: 'Légumes', description: 'Légumes frais', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg' },
    { id: 'produits-laitiers', name: 'Produits laitiers', description: 'Produits laitiers', image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg' },
    { id: 'salades', name: 'Salades', description: 'Salades fraîches', image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg' },
    { id: 'tomates', name: 'Tomates', description: 'Tomates fraîches', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg' },
];

// Helper function to get category image by name (case-insensitive)
export const getCategoryImage = (categoryName: string): string => {
    const category = CATEGORIES.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.image || 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg';
};

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
