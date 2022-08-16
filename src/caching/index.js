import AdminCache from "./admin.cache.js";
import ApartmentCache from "./apartment.cache.js";
import CashCache from "./cash.cache.js";
import client from "./connection.js";
import RentCache from "./rent.cache.js";
import TenantCache from "./tenant.cache.js";

export const Cache = client;
export const AdminCaching = AdminCache;
export const ApartmentCaching = ApartmentCache;
export const CashCaching = CashCache;
export const RentCaching = RentCache;
export const TenantCaching = TenantCache;
