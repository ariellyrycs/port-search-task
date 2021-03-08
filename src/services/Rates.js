

const getAvailableRates = async () => {
  const res = await fetch(`/prod/ports`);
  return await res.json();
};

const getDetailRates = async (origin, destination) => {
  const res = await fetch(`/prod/rates?origin=${origin}&destination=${destination}`);
  return await res.json();
};

export {
  getAvailableRates,
  getDetailRates
}