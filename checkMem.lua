local procfs = require("lj2procfs.procfs")
local jsonPrint = require("json-util")

local meminfo = procfs.meminfo
local memtotal = meminfo.MemTotal.size
local memfree = meminfo.MemFree.size
local memused = memtotal - memfree
local memshared = meminfo.Shmem.size
local memcached = meminfo.Cached.size
local membuffers = meminfo.Buffers.size

local swaptotal = meminfo.SwapTotal.size
local swapfree = meminfo.SwapFree.size
local swapused = swaptotal - swapfree


jsonPrint.printValue(meminfo)
