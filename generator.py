#!/usr/bin/env python

from JekyllMdFile import JekyllMdFile
from slugify import slugify 
import os
import sys, subprocess
from elasticsearch import Elasticsearch


def generateFrontMatter(taxo_path, version, doc_site, old_path, url_to_md):

    with open(taxo_path, "r") as taxonomy:

        level_ref = -1
        old_level = 0
        order = 0
        c_categ = []

        # Read the taxonomy
        while 1:
            line = taxonomy.readline()
            if not line:
                break
            
            if "http" in line: continue
            # print line

            # Get the level of depth for the current link
            lineB = line.split('*')
            if len(lineB) <= 1 : continue
            spaces = lineB[0]
            level = 0
            for char in spaces:
                # print "-%s- is number : %d" % (char,ord(char))
                if ord(char) == 32:
                    level += 0.5
                elif ord(char) == 9 :
                    level+=1
                else:
                    print "-%s- is number : %d \n line :%s" % (char, ord(char), line)
            if level != old_level and level_ref == -1  : level_ref = level 
            level = int(level)/level_ref
            # print "space : %s has a length of %d" % (spaces,level)

            # Retrieve the name of the file

            lineB = lineB[1].split('[')[1].split(']')

            old_title = ""

            if 'title' in locals():
                old_title = title
            title = lineB[0]

            # Retrieve the path of the file
            lineB = lineB[1].split('(')[1].split(')')

            old_base_name = ""

            if 'base_name' in locals():
                old_base_name = base_name
            base_name = lineB[0]

            # print "Line in process : %s with level of %d " % (title, level)

            

            if level <= old_level and old_base_name  :
                
                JekyllMdFile.files.append(
                    JekyllMdFile(doc_site, version, order, old_path, old_title,
                                old_base_name, c_categ, url_to_md))
                order += 1

            if level > old_level:
                if old_title:
                    c_categ.append(old_title)
                old_level = level

            while level < old_level:
                try :
                    c_categ.pop()
                except IndexError :
                    print c_categ

                old_level -= 1

    JekyllMdFile.files.append(
        JekyllMdFile(doc_site, version, order, old_path, title, base_name, c_categ,
                    url_to_md))
    order += 1 
    JekyllMdFile.files.append(
        JekyllMdFile(doc_site, version, order, old_path, "index", "index.md", [],
                    url_to_md))

    # a_basenames = [f.base_name for f in JekyllMdFile.files]
    # print len(a_basenames)

def generateFiles():
    for f in JekyllMdFile.files:
        # print f.version
        # print f.path

        if not os.path.exists(f.path):
            # print f.path +  " doesn't exist"
            os.makedirs(f.path)
        
        # print "Le bon basename "+f.base_name

        with open(f.old_path +f.base_name,"r") as src :
            while 1:
                line = src.readline()
                if not line : break
            
                f.parseLine(line)

        # print f.parts
        with open(f.path +"/"+  f.base_name, "w") as dest:
          
            dest.write(f.front_matter)
            if f.hasHTML : dest.write('{::options parse_block_html="true" /}\n')
            # content = f.content.split("\n")
            f.injectParts()
            dest.writelines(f.content)  


def generate_doc(doc, docSitePath, version, destPath):

    urlToMd = docSitePath+"/md/"
    taxonomy = urlToMd +"taxonomy.md"
    urlToNwMd = destPath+"_"+doc+"/"+version

    generateFrontMatter(taxonomy, version, doc, urlToMd, urlToNwMd)

    generateFiles()

def indexingDocuments(elasticSearchUrl, docSite, version):
    index = docSite+"_"+version
    es = Elasticsearch()

    cmd = "curl -X DELETE \"%s/%s\"" % (elasticSearchUrl, index  ) 
    try:
        subprocess.check_output([cmd],shell=True,  stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        print e
    cmd ="curl -X PUT \"%s/%s\"" % (elasticSearchUrl, index  )

    try:
        subprocess.check_output([cmd],shell=True,  stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        print e

    for doc in JekyllMdFile.files :
        cmd= "curl -X POST \"%s/%s/doc\" -H 'Content-Type: application/json' -d'%s'"  % (elasticSearchUrl, index, doc.indexingContent())
       
        res = es.index(index=index, doc_type='doc', body=doc.indexingContent())
       
        print res
        # # print cmd
        # try:
        #     subprocess.check_output([cmd],shell=True,  stderr=subprocess.STDOUT)
        # except subprocess.CalledProcessError as e:
        #     print e


