#!/usr/bin/env python

import sys, subprocess, generator

repos = {
    "bonita":"/home/bonitasoft/dev/bonita-doc",
    "bcd":"/home/bonitasoft/dev/bonita-continuous-delivery-doc",
    "ici":"/home/bonitasoft/dev/bonita-ici-doc"
}
destPath = "/home/bonitasoft/dev/proto_doc/"

elasticSearchUrl = "localhost:9200"


if len(sys.argv) < 3 : 
    print "Not enough argument, we expected : python generate_doc.py <product> <version>"
    exit()

if sys.argv[1] in repos:
    print repos[sys.argv[1]]
    repo = sys.argv[1]
    path = repos[repo]
    print "try to checkout the version ..."


    version = sys.argv[2]

    cmd ="cd %s && git checkout %s  && git pull " % (path, version )

    try:
        subprocess.check_output([cmd],shell=True,  stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        print e

    print "repo checkout with success"

    print "clean destination... "

    try:
        cmd ="cd %s  && rm -rf %s " % (destPath, version )

    except subprocess.CalledProcessError as e:
        print e

    print "try to generate documention %s %s ..." % (path, version)
    
    generator.generate_doc(repo, path,version, destPath)

    print "... GENERATION SUCCESSFUL ..."

    print "try to indexing documentation ..."

    generator.indexingDocuments(elasticSearchUrl, repo, version)
  
    print "... INDEXATION SUCCESSFUL ..."

else:
    print "Unkown repo"
    