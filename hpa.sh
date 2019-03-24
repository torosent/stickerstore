#! /bin/sh

kubectl autoscale deployment stickerstore --namespace stickerstore --cpu-percent=50 --min=1 --max=10

kubectl get hpa --namespace stickerstore

watch -n0.5 kubectl get hpa --namespace stickerstore

kubectl run -i --tty load-generator --generator=run-pod/v1 --namespace stickerstore --image=busybox /bin/sh

#In the shell run
while true; do wget -q -O- http://stickerstore.stickerstore:80/load; done
