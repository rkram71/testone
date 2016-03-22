<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
|--------------------------------------------------------------------------
| LICENSE
|--------------------------------------------------------------------------
|    This file is part of ldap_auth.php
|
|    ldap_auth is free software: you can redistribute it and/or modify
|    it under the terms of the GNU General Public License as published by
|    the Free Software Foundation, either version 3 of the License, or
|    (at your option) any later version.
|
|    ldap_auth is distributed in the hope that it will be useful,
|    but WITHOUT ANY WARRANTY; without even the implied warranty of
|    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
|    GNU General Public License for more details.
|
|    You should have received a copy of the GNU General Public License
|    along with ldap_auth.  If not, see <http://www.gnu.org/licenses/>.
| 
|--------------------------------------------------------------------------
| LDAP configuration
|--------------------------------------------------------------------------
| Author: Dwayne Hale
|This configuration file belongs to the LDAP library ldap_auth.php
|
|
|
| If these are not set then your LDAP auths will not work.
| If something in this file confuses you, you probably shouldn't be editing it.
|
*/
$config['ldap_server']="172.16.0.22"; //set this to your LDAP server name.
$config['user_prefix']=NULL; //if you specify your domain you must escape the backslash '\' with a backslash '\\'
$config['user_suffix'] = "@testad.com";
$config['dc'] = "dc=TestAD,dc=COM";
$config['apigroup'] ="CN=Chat API User,OU=Security Groups,OU=Groups,DC=TestAD,DC=com";
$config['ds'] = ldap_connect($config['ldap_server']) or die("Could not connect to LDAP server.");
ldap_set_option($config['ds'], LDAP_OPT_PROTOCOL_VERSION,3);
ldap_set_option($config['ds'], LDAP_OPT_REFERRALS,0);