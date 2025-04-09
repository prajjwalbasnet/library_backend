export const calculateFine = (dueDate) => {
  const finePerHour = 0.1;
  const today = new Date();

  if (today > dueDate) {
    const lateHours = Math.ceil(((today - dueDate) / 60) * 60 * 1000);
    const fine = lateHours * finePerHour;
    return fine;
  }

  return 0;
};
