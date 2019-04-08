// Copyright 2018 by Teradata Corporation. All Rights Reserved
// TERADATA CORPORATION CONFIDENTIAL AND TRADE SECRET

package com.teradata.sample ;

import java.sql.* ;

public class ProcJava1
{
    public static void procJava1 (int nValueToInsert, String sTableName)
    throws SQLException
    {
        Connection con = DriverManager.getConnection ("jdbc:default:connection") ;
        try
        {
            PreparedStatement ps = con.prepareStatement ("insert into " + sTableName + " values (?)") ;
            try
            {
                ps.setInt (1, nValueToInsert) ;
                ps.executeUpdate () ;
            }
            finally
            {
                ps.close () ;
            }
        }
        finally
        {
            con.close () ;
        }
    } // end procJava1
} // end class ProcJava1
