export const mockRestaurants = [
  {
    id: 1,
    name: 'Spicy Bites',
    image: '/images/spicyBites.jpg',
    description: 'Delicious spicy foods from around the world.',
    rating: 4.5,
    address: 'kathmandu',
    phone: '987654321',
    deliveryTime: '30-40 min',
    cuisine: 'Indian',
    status: 'active',
    menuItems: [
      {
        id: 101,
        name: 'Chicken Curry',
        price: 9.99,
        isVeg: false,
        description: 'Spicy chicken in rich curry sauce.',
        image: '/images/chicken.jpg'
      },
      {
        id: 102,
        name: 'Paneer Tikka',
        price: 7.49,
        isVeg: true,
        description: 'Grilled paneer with spicy marinade.',
        image: '/images/paneer.jpg'
      },
      {
        id: 103,
        name: 'MOMO',
        price: 7.49,
        isVeg: true,
        description: 'Veg MOMO',
        image: '/images/momo.jpg'
      },
      {
        id: 104,
        name: 'Veg Biryani',
        price: 250,
        isVeg: true,
        description: 'Veg MBiryai',
        image: '/images/veg niryani.jpg'
      }
    ]
  },
  {
    id: 2,
    name: 'Green Garden',
    image: '/images/green.jpg',
    description: 'Fresh vegetarian and vegan delights.',
    rating: 4.2,
    deliveryTime: '20-30 min',
    cuisine: 'Vegan',
    status: 'pending',
    menuItems: [
      {
        id: 201,
        name: 'Vegan Salad',
        isVegan: true,
        price: 6.99,
        description: 'Mixed greens with citrus dressing.',
        image: '/images/vegan-salad.jpg'
      },
      {
        id: 202,
        name: 'Tofu Stir Fry',
        isVegan: true,
        price: 8.49,
        description: 'Tofu with seasonal vegetables.',
        image: '/images/tofu-stirfry.jpg'
      }
    ]
  },
  {
    id: 3,
    name: 'Namaste Restro',
    image: '/images/neplai restro.jpg',
    description: 'Juicy Momo and crispy Selroti delivered fast.',
    rating: 4.7,
    deliveryTime: '25-35 min',
    cuisine: 'Nepali',
    status: 'active',
    menuItems: [
      {
        id: 301,
        name: 'Chicken Momo',
        price: 5.99,
        isVegan: false,
        description: 'Spicy chicken momos with achar.',
        image: '/images/chicken momo.jpg'
      },
      {
        id: 302,
        name: 'Aalu Sadheko',
        price: 5.99,
        isVegan: true,
        description: 'Spicy aalu with achar.',
        image: '/images/aalu.jpg'
      },
      {
        id: 303,
        name: 'PaniPuri',
        price: 5.99,
        isVegan: true,
        description: 'Spicy PaniPuri',
        image: '/images/panipurti.jpg'
      },
      {
        id: 304,
        name: 'Selroti',
        isVegan: true,
        price: 99,
        description: 'Circle rings with sweet',
        image: '/images/Selroti.jpg'
      },
    ]
  },
   {
    id: 4,
    name: 'Green Garden',
    image: '/images/green.jpg',
    description: 'Fresh vegetarian and vegan delights.',
    rating: 4.2,
    deliveryTime: '20-30 min',
    cuisine: 'Vegan',
    status:'active',
    menuItems: [
      {
        id: 401,
        name: 'Veg biryani',
        price: 6.99,
        isVegan: true,
        description: 'Mixed greens with citrus dressing.',
        image: '/images/veg niryani.jpg'
      },
      {
        id: 402,
        name: 'Milk tea',
        price: 8.49,
        description: 'milk tea with masala.',
        image: '/images/milktea.jpg'
      },
      {
        id: 403,
        name: 'Veg Salad',
        price: 8.49,
        isVegan: true,
        description: 'Veg Salad with protein',
        image: '/images/vgsalad.jpg'
      },
      {
        id: 404,
        name: 'Veg momo',
        price: 8.49,
        isVegan: true,
        description: 'Veg Momo',
        image: '/images/momo.jpg'
      }
    ]
  },
  // Add more restaurants as needed...
];
