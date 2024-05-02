provider "google" {
  project = "kubernetes-417417"
  credentials = file("./kubernetes-credentials.json")
  region  = "us-central1"
}


resource "google_container_cluster" "kubernetes_assignment_cluster" {
  name               = "kubernetes"
  location           = "us-central1-a"
  initial_node_count = 1


  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
    image_type = "COS_CONTAINERD"
    disk_type = "pd-standard"
  }
}



resource "google_compute_disk" "persistent_disk" {
  name  = "kubernetes-disk"
  type  = "pd-standard"
  zone  = "us-central1-a" 
  size  = 10
}