
export const formatRupiah = (amount: any) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

export const formatRupiahEdit = (value: any) => {
  const numberString = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  const numberValue = Number(numberString); // Convert to number

  // Check if numberValue is valid
  if (isNaN(numberValue)) {
    return ""; // Return empty if not a number
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Optional: set minimum fraction digits
    maximumFractionDigits: 0, // Optional: set maximum fraction digits
  }).format(numberValue); // Format the cleaned number
};
