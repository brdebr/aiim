# Backup docker-volume

docker run --rm -v aiim_aiim-db_data:/data -v $(pwd):/backup ubuntu tar cvf /backup/aiim-db_data_volume.tar /data

# Restore docker-volume

docker run --rm -v aiim_aiim-db_data:/data -v $(pwd):/backup ubuntu bash -c "cd /data && tar xvf /backup/aiim-db_data_volume.tar --strip 1"

docker run --rm -v aiim_aiim-db_data_restore:/data -v $(pwd):/backup ubuntu tar xvf /backup/aiim-db_data_volume.tar /data