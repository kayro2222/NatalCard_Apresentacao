﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace NatalCard
{
    public static class CriptoHelper
    {
        public static string HashMD5(string senha)
        {
            var bytes = Encoding.ASCII.GetBytes(senha);
            var md5 = MD5.Create();
            var hash = md5.ComputeHash(bytes);
            var res = string.Empty;
            for(int i=0; i < hash.Length; i++)
            {
                res += hash[i].ToString("x2");
            }
            return res;
        }
    }
}