import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions';
import { products_url } from '../utils/constants';

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    let maxPrice = action.payload.map((product) => product.price);
    maxPrice = Math.max(...maxPrice);

    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
    };
  }

  // viewr
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }

  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }

  // sort
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }

  if (action.type === SORT_PRODUCTS) {
    const { filtered_products, sort } = state;
    let tempProducts = [...filtered_products];

    if (sort === 'price-lowest') {
      tempProducts = tempProducts.sort((a, b) => a.price - b.price);
    }

    if (sort === 'price-highest') {
      tempProducts = tempProducts.sort((a, b) => b.price - a.price);
    }

    if (sort === 'name-a') {
      tempProducts = tempProducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }

    if (sort === 'name-z') {
      tempProducts = tempProducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }

    return { ...state, filtered_products: tempProducts };
  }

  // filters
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;

    return { ...state, filters: { ...state.filters, [name]: value } };
  }

  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, category, company, color, price, shipping } = state.filters;

    let filteredProducts = [...all_products];

    // FILTERING
    // text
    if (text) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(text)
      );
    }

    // category
    if (category !== 'all') {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // company
    if (company !== 'all') {
      filteredProducts = filteredProducts.filter(
        (product) => product.company === company
      );
    }

    // colors
    if (color !== 'all') {
      filteredProducts = filteredProducts.filter((product) =>
        product.colors.find((item) => item === color)
      );
    }

    // price
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= price
    );

    // shipping
    if (shipping) {
      filteredProducts = filteredProducts.filter(
        (product) => product.shipping === true
      );
    }

    return { ...state, filtered_products: filteredProducts };
  }

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: '',
        company: 'all',
        category: 'all',
        color: 'all',
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
