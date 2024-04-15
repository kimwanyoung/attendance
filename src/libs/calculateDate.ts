const calculateEndDate = (days: number): Date => {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today;
};

export { calculateEndDate };
