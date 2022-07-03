import { ONE, PAGINATION } from "./app.constant.js";

export function generateToken() {
  const SACK = "1234567890";
  const SACK_LENGTH = SACK.length;
  const TOKEN_LENGTH = 5;

  let token = "";

  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += SACK[Math.floor(Math.random() * SACK_LENGTH)];
  }

  return token;
}

export function isValidRoomNumber(roomNumber = "") {
  // A room number will be five characters starting with
  // 'R' followed by the floor number and the room number
  if (!roomNumber) return false;

  const roomNumberLength = roomNumber.length;

  if (roomNumberLength !== 5) return false;

  if (!roomNumber.startsWith("R")) return false;

  return !isNaN(Number(roomNumber.substring(1, roomNumberLength)));
}

export function isValidPrice(price = 0) {
  return price && !isNaN(Number(price));
}

export async function isAuthenticUser(model, payload = {}) {
  return await model.findOne({
    id: payload.id,
    username: payload.username,
    email: payload.email
  });
}

export function pagination(page = 1, pageSize = 12) {
  if (page < ONE) {
    page = PAGINATION.page;
  }

  if (pageSize < ONE) {
    pageSize = PAGINATION.pageSize;
  }

  let offset = (page - ONE) * pageSize;
  let limit = pageSize;

  return { limit, skip: offset };
}
