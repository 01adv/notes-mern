export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regex pattern
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return '';

  const names = name.split(' ');
  let initials = '';

  for(let i = 0; i < Math.min(names.length, 2); i++) {
    initials += names[i][0];
  }
  return initials.toUpperCase();
}
