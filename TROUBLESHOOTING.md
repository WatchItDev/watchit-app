# Troubleshooting

In this page, we will address some common issues that the users often face while using app.

## Potential Issues

### Issue: `hangs connecting` [#33](https://github.com/ZorrillosDev/watchit-desktop/issues/33) 
On many occasions this happens because ipfs has conflicts with the ports in use.

1) First of all check if you have busy ports:
    * Check busy ports: `6002, 9090, 4010, 4011`
    * Stop services in the ports above listed  
    * Run the app again


This is a known issue which occurs when you are using desktop app. It will be fixed in upcoming releases.
