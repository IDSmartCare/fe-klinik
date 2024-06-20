import { differenceInCalendarYears, differenceInDays, differenceInMonths } from "date-fns";

export const calculateAge = (birthDate: any) => {
    if (!birthDate) {
        return {
            years: "",
            months: "",
            days: ""
        }
    }
    const today = new Date();

    const ageInYears = differenceInCalendarYears(today, birthDate);
    const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (lastBirthday > today) {
        lastBirthday.setFullYear(lastBirthday.getFullYear() - 1);
    }
    const daysSinceLastBirthday = differenceInDays(today, lastBirthday);
    const monthsSinceLastBirthday = differenceInMonths(today, lastBirthday);

    return {
        years: ageInYears,
        months: monthsSinceLastBirthday,
        days: daysSinceLastBirthday,
    };
}