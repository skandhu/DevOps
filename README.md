How to Setup ELK montioring for K8s Cluster


do 
create the logging namespace and switch to it

Kubectl apply -f Elasticsearch.yaml
kubectl apply -f kibana.yaml

then update the url of elasticsearch and kibana in filebeat yeaml file then apply filebeat yaml file

useful links:

filebeat: https://www.elastic.co/docs/reference/beats/filebeat/running-on-kubernetes
Elastic and Kibana: https://www.elastic.co/blog/how-to-run-elastic-cloud-on-kubernetes-from-azure-kubernetes-service