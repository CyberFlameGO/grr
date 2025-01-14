#!/usr/bin/env python
"""Load all blob stores so that they are visible in the registry."""

from grr_response_core.lib.util import compatibility
from grr_response_server import blob_store
from grr_response_server.blob_stores import db_blob_store
from grr_response_server.blob_stores import dual_blob_store
from grr_response_server.databases import mem_blobs


def RegisterBlobStores():
  """Registers all BlobStore implementations in blob_store.REGISTRY."""
  blob_store.REGISTRY[compatibility.GetName(
      db_blob_store.DbBlobStore)] = db_blob_store.DbBlobStore
  blob_store.REGISTRY[compatibility.GetName(
      dual_blob_store.DualBlobStore)] = dual_blob_store.DualBlobStore
  blob_store.REGISTRY[compatibility.GetName(
      mem_blobs.InMemoryBlobStore)] = mem_blobs.InMemoryBlobStore
