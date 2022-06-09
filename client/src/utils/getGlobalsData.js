import { categories } from "../globals";

export const getSubcategories = (category) => {
  const subCategories =
    categories.find(item => {
      return item.label === category;
    })?.subCategories ?? [];
    return subCategories;
}

export const getProductsOfSubCategory = (category, subcategory) => {
  const products =
    categories.find(item => {
      return item.label === category;
    })?.subCategories.find(item => {
      return item.label === subcategory;
    })?.products ?? [];
    return products;
}