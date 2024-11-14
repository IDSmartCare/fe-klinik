export const processDataDoctorsSchedule = (data: any[]) => {
  return data.flatMap((item) =>
    item.days.map((day: string) => ({
      ...item,
      days: [day], // Setiap hari akan menjadi baris baru
    }))
  );
};
