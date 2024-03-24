export const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substring(2, 9);
};
export const generateUniqueCardNumber = () => {
  const randomCardNumber = Math.floor(Math.random() * 10000000000000000);
  return parseInt(randomCardNumber.toString().padStart(16, '0'),10);
};
export const generateUniqueCardPin = () => {
  let randomNumber = Math.floor(Math.random() * 900) + 100;
  return parseInt(randomNumber.toString().padStart(3, '0'), 10);
};
