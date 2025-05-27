## Create a Cron Job
To run this script once daily:

1. Open the crontab editor:

```bash 
crontab -e
```

2. Add this line to schedule the job (e.g., every day at 1:00 AM):

```bash
0 1 * * * /usr/bin/node /home/ubuntu/AIVT-dev/backend/classifier/cronTask/dailyUpdate.js >> /home/ubuntu/AIVT-dev/logs/cve-fetch.log 2>&1
```

3. Change permission.

´´´
chmod +x /home/ubuntu/AIVT-dev/backend/classifier/cronTask/dailyUpdate.js
´´´

### Explanation

* 0 1 * * * = every day at 01:00 AM
* /usr/bin/node = path to your Node.js binary (run which node to find it)
* /home/ubuntu/AIVT-dev/backend/classifier/index.js = absolute path to your script
* >> /var/log/cve-fetch.log 2>&1 = logs output and errors