# Troubleshooting

In this page, we will address some common issues that the users often face while using app.

## Potential Issues

### Issue: `hangs bootstrapping` [#60](https://github.com/ZorrillosDev/watchit-desktop/issues/60) 
On many occasions this happens because ipfs has conflicts with the ports in use.

How solve it?
* Check busy ports: `6002, 9090, 4010, 4011`
* Stop services in the ports above listed  
* Run the app again

### Issue: `hangs connecting` [#33](https://github.com/ZorrillosDev/watchit-desktop/issues/33)
This happens when orbit cannot find peers that share the metadata with it. The metadata replication is constantly updating adding new content, so the versions of each metadata are out of date and the workers simply stop sharing it. The public key is pointing to different versions in each change, so the way to solve it is:

How solve it?
* Please logout and try login again with the key.


This is a known issue which occurs when you are using desktop app. It will be fixed in upcoming releases.
