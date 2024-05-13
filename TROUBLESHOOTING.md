# Troubleshooting

In this page, we will address some common issues that the users often face while using app.

## Potential Issues

### Issue: `hangs bootstrapping` [#60](https://github.com/WatchItDev/watchit-desktop/issues/60) 
On many occasions this happens because ipfs has conflicts with the ports in use.

How solve it?
* Check busy ports: `6002, 9090, 4010, 4011`
* Stop services in the ports above listed  
* Run the app again

### Issue: `hangs connecting` [#33](https://github.com/WatchItDev/watchit-desktop/issues/33)
This happens when orbitdb cannot find peers that share metadata with it. The metadata replication is updated to add new content, so it is likely that you are accessing an outdated version of the metadata. The public key points to different versions on each change, so it is likely that workers simply stop sharing it.

How solve it?
* Please logout and try login again with the key.


This is a known issue which occurs when you are using desktop app. It will be fixed in upcoming releases.
