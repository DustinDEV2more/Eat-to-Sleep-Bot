module.exports = function (type_number) {
    if (type_number == 0)  return "Stranger";
    if (type_number == 1)  return "Member";
    if (type_number == 50)  return "Bot";
    if (type_number == 99)  return "Admin";
    return "Jemand"
}