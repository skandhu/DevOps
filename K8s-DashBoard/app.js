import express from 'express';
import { KubeConfig, CoreV1Api, AppsV1Api } from '@kubernetes/client-node';

const app = express();
const port = 3000;

// Kubernetes client setup
const kubeConfig = new KubeConfig();
kubeConfig.loadFromDefault();
const coreV1Api = kubeConfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeConfig.makeApiClient(AppsV1Api);

// Fetch cluster details
async function getClusterDetails() {
  const cluster = kubeConfig.getCurrentCluster();
  return cluster.name;
}

// Fetch namespaces
async function getNamespaces() {
  const res = await coreV1Api.listNamespace();
  return res.body.items.map(namespace => namespace.metadata.name);
}

// Fetch pods in all namespaces
async function getPods() {
  const namespaces = await getNamespaces();
  const pods = {};
  
  for (const namespace of namespaces) {
    const res = await coreV1Api.listNamespacedPod(namespace);
    pods[namespace] = res.body.items.map(pod => pod.metadata.name);
  }
  return pods;
}

// Fetch deployments in all namespaces
async function getDeployments() {
  const namespaces = await getNamespaces();
  const deployments = {};

  for (const namespace of namespaces) {
    const res = await appsV1Api.listNamespacedDeployment(namespace);
    deployments[namespace] = res.body.items.map(deployment => deployment.metadata.name);
  }
  return deployments;
}

// Fetch services in all namespaces
async function getServices() {
  const namespaces = await getNamespaces();
  const services = {};

  for (const namespace of namespaces) {
    const res = await coreV1Api.listNamespacedService(namespace);
    services[namespace] = res.body.items.map(service => service.metadata.name);
  }
  return services;
}

// Route to display the Kubernetes cluster details
app.get('/', async (req, res) => {
  const clusterName = await getClusterDetails();
  const namespaces = await getNamespaces();
  const pods = await getPods();
  const deployments = await getDeployments();
  const services = await getServices();

  res.send(`
    <h1>Kubernetes Cluster Details</h1>
    <p><strong>Cluster Name:</strong> ${clusterName}</p>
    <h2>Namespaces</h2>
    <ul>
      ${namespaces.map(namespace => `<li>${namespace}</li>`).join('')}
    </ul>
    <h2>Pods</h2>
    <ul>
      ${Object.keys(pods).map(namespace => `
        <li><strong>${namespace}:</strong>
          <ul>
            ${pods[namespace].map(pod => `<li>${pod}</li>`).join('')}
          </ul>
        </li>
      `).join('')}
    </ul>
    <h2>Deployments</h2>
    <ul>
      ${Object.keys(deployments).map(namespace => `
        <li><strong>${namespace}:</strong>
          <ul>
            ${deployments[namespace].map(deployment => `<li>${deployment}</li>`).join('')}
          </ul>
        </li>
      `).join('')}
    </ul>
    <h2>Services</h2>
    <ul>
      ${Object.keys(services).map(namespace => `
        <li><strong>${namespace}:</strong>
          <ul>
            ${services[namespace].map(service => `<li>${service}</li>`).join('')}
          </ul>
        </li>
      `).join('')}
    </ul>
  `);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
