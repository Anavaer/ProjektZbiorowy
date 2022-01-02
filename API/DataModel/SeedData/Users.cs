using System.Collections.Generic;
using API.DataModel.Entities.AspNetIdentity;

namespace API.DataModel.SeedData
{
    public static class Users
    {
        public static List<User> Clients
        {
            get
            {
                return new List<User>
                {
                    new User
                    {
                        FirstName = "John",
                        LastName = "Snow",
                        City = "Winterfell",
                        Address = "Somewhere St. 69",
                        CompanyName = null,
                        NIP = null,
                        UserName = "john_snow",
                    },
                    new User
                    {
                        FirstName = "Greta",
                        LastName = "Green",
                        City = "Alabama",
                        Address = "Kinder garden 123",
                        CompanyName = null,
                        NIP = null,
                        UserName = "greta_green",
                    },
                    new User
                    {
                        FirstName = "Andrew",
                        LastName = "Kloc",
                        City = "Northshire",
                        Address = "Route 66",
                        CompanyName = "Build Me Up",
                        NIP = "1122344550",
                        UserName = "a_kloc",
                    },
                    new User
                    {
                        FirstName = "Andrew",
                        LastName = "Golota",
                        City = "Warsaw",
                        Address = "Zlote Tarasy 23",
                        CompanyName = "Punch me Sp. z o.o.",
                        NIP = "5567788900",
                        UserName = "a_golota",
                    },
                    new User
                    {
                        FirstName = "Client",
                        LastName = "Lorem",
                        City = "Rome",
                        Address = "Bellisima 21",
                        CompanyName = null,
                        NIP = null,
                        UserName = "client",
                    },
                };
            }
        }

        public static List<User> Workers
        {
            get
            {
                return new List<User>
                {
                    new User
                    {
                        FirstName = "Arkadiusz",
                        LastName = "Polaczek",
                        City = "Warsaw",
                        Address = "Biedna 69A",
                        CompanyName = null,
                        NIP = null,
                        UserName = "areczek",
                    },
                    new User
                    {
                        FirstName = "Worker",
                        LastName = "Ipsum",
                        City = "Mexico City",
                        Address = "Tacos 66",
                        CompanyName = null,
                        NIP = null,
                        UserName = "worker",
                    },
                };
            }
        }

        public static List<User> Admins
        {
            get
            {
                return new List<User>
                {
                        new User
                    {
                        FirstName = "Janusz",
                        LastName = "Wyzyskiwacz",
                        City = "Pcim Dolny",
                        Address = "Sasanki 69",
                        CompanyName = "Uslugi Sprzatajace Janusz Wyzyskiwacz",
                        NIP = "8104022666",
                        UserName = "admin",
                    }
                };
            }
        }
    }
}