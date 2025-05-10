How to Setup ELK montioring for K8s Cluster


do 
create the logging namespace and switch to it

Kubectl apply -f Elasticsearch.yaml
kubectl apply -f kibana.yaml

then update the url of elasticsearch and kibana in filebeat yeaml file then apply filebeat yaml file
