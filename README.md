📌 Lấy IP gateway:
```bash
ip route | grep docker
```
Example:
```bash
[root@cloudvps1588 ~]# ip route | grep docker
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1
```
