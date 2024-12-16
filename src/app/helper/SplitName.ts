export const splitName = (fullName: string) => {
  const nameParts = fullName.trim().split(" ");

  if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: nameParts[0] };
  } else {
    return {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" "),
    };
  }
};
