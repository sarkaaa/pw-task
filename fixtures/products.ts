export const PRODUCTS: { name: string; price: string }[] = [
  {
    name: "Hoodie",
    price: "$89.00",
  },
  {
    name: "Chino Pants",
    price: "$49.00",
  },
  {
    name: "Puffer Jacket",
    price: "$125.00",
  },
  {
    name: "Electric Bike",
    price: "$599.00",
  },
  {
    name: "Wireless Over-Ear Headphones",
    price: "$89.00",
  },
  {
    name: "Serving Plate",
    price: "$49.00",
  },
  {
    name: "Espresso Cup",
    price: "$9.00",
  },
];

export const HOODIE = {
  ...PRODUCTS[0],
  description: "Classic black hoodie made from soft cotton fabric for everyday comfort. Features a relaxed fit, adjustable drawstring hood and front kangaroo pocket. Simple and versatile for layering in any season.",
  productInfo: {
    title: "Product Information",
    countryOfOriginTitle: "Country of origin",
    countryOfOrigin: "ro",
  },
  shippingAndReturnInfo: {
    title: "Shipping & Returns",
    shippingInfo: "Your package will arrive in 3-5 business days at your pick up location or in the comfort of your home.",
    exchangeIngo: "Is the fit not quite right? No worries - we'll exchange your product for a new one.",
    returnInfo: "Just return your product and we'll refund your money. No questions asked – we'll do our best to make sure your return is hassle-free.",
  },
  relatedProductsTitle: "You might also want to check out these products.",
}
