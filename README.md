# mpnote

## requires
DB : mongodb 3.4
NodeJS & Express JS
React 15

## Scripts
### install dependancies
```
npm install
```

### for develop
```
npm run development
```

### for build
```
npm run clean
npm run build
```

### for production
```
npm run start
```

## running env.
### node process manage
pm2
see details : https://engineering.linecorp.com/ko/blog/pm2-nodejs/
```
pm2 start build/main.js --name "mpnote"
```

### apache conf
```
<VirtualHost *:80>
     ServerAdmin nasty@localhost
     ServerName mcard.mpnote.com
     ServerAlias mcard.mpnote.com
     DocumentRoot /home/mpnote/invitation/public
	 ProxyRequests off
	 <Proxy *>
		 Order deny,allow
		 Allow from all
	 </Proxy>
	 <Location />
		 ProxyPass http://localhost:9898/
	 	 ProxyPassReverse http://localhost:9898/
	 </Location>
     ErrorLog ${APACHE_LOG_DIR}/mpnote_net_error.log
     CustomLog ${APACHE_LOG_DIR}/mpnote_net_access.log combined
</VirtualHost>
```