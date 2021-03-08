module.exports = function (type_number) {
    if (type_number == 0)  return "Stranger";
    if (type_number == 1)  return "Member";
    if (type_number == 50)  return "Bot";

    //Alles ab 90 hat zugang zum Admin Panal
    if (type_number == 99)  return "Admin";
    return "Jemand"
}