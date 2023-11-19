export const getRelativeDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const differenceInYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const formatter = getFormatter();
  if (differenceInYears > 0) {
    return formatter.format(-differenceInYears, "year");
  }
  const differenceInMonths = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  if (differenceInMonths > 0) {
    return formatter.format(-differenceInMonths, "month");
  }
  const differenceInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (differenceInDays > 0) {
    return formatter.format(-differenceInDays, "day");
  }
  const differenceInHours = Math.floor(diff / (1000 * 60 * 60));
  if (differenceInHours > 0) {
    return formatter.format(-differenceInHours, "hour");
  }
  const differenceInMinutes = Math.floor(diff / (1000 * 60));
  if (differenceInMinutes > 0) {
    return formatter.format(-differenceInMinutes, "minute");
  }
  const differenceInSeconds = Math.floor(diff / 1000);
  if (differenceInSeconds > 0) {
    return formatter.format(-differenceInSeconds, "second");
  }
};

const getCurrentLocale = () => {
  const locale = navigator.language;
  return locale;
};

const getFormatter = () => {
  const rtf = new Intl.RelativeTimeFormat(getCurrentLocale(), {
    style: "narrow",
    numeric: "auto",
  });
  return rtf;
};
