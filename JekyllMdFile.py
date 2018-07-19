# -*- coding: utf-8 -*-
#!/usr/bin/env python
from slugify import slugify 
import re
from shutil import copyfile
import os
import datetime
import string

class JekyllMdFile(object):

    files =[]
    front_matter =""

    def __init__(self, docSite, version, order, old_path, title, base_name,categs, urlToNwMd):

        # print "categories : %s " % categs
        self.categs= [categ for categ in categs if categs]

        self.parts = []

        self.hasHTML = False

        self.content =""

        self.title = title 

        self.base_name = base_name 

        self.path = urlToNwMd+"/"+("/".join([slugify(categ) for categ in categs]))
        
        self.old_path=old_path
        
        self.order = order

        self.version = version

        self.docSite = docSite

        self.full_text_content =""

        self.front_matter = """---
layout : doc
title : \"%s\"
version : \"%s\"
categories:\n%s
order : %d
---
""" % (self.title, self.version, self.getCategs(), self.order)

        # print "front matter of %s is %s\n" % (self.base_name, self.front_matter) 

    @staticmethod
    def getPath(basename):
        path = ""
        docSite = ""
        version = ""
            
        

        for md in JekyllMdFile.files:
            
            if basename == md.base_name :
                for c in md.categs :
                    path += slugify(c)+"/"
                
                docSite = md.docSite
                version = md.version

        if not docSite : 
            # print "-"+basename+"- line : \n"+ line +" "
            raise Exception("File not found")

        res = docSite+"/"+version+"/"+path
        return res
       
        
        

    def getCategs(self):
        result = ""

        for index,categ  in enumerate(self.categs) :
            result += "  - "+categ
            result += "\n" if index < len(self.categs)-1 else ""
        return result

    
    def  parseLine(self,line):

        clean = True 

        if ":fa-" in line :
            fa = line.split(':')[1]
            line = line.replace(':'+fa+':', "<i></i>{:.fa ."+fa +"}")
            clean = False 


        if "<div" in line:
            if not self.hasHTML : self.hasHTML = True
            clean = False

        if line[0:3] == "## " :
            part = line.strip("## ").strip("\n")
            self.addH2(part)
            line = "\n## "+part+"\n{:#"+slugify(part)+"}\n"
            self.full_text_content += part
            # print line

        if line[0:4] == "### " :
            part = line.strip("### ").strip("\n")
            self.addH3(part)
            line = "\n### "+part+"\n{:#"+slugify(part)+"}\n"
            self.full_text_content += part
            # print line

        if "(images/" in line :
            # print "images in process..."
            line = self.image_management(line)
            clean = False

        if  "](" in line and ".md" in line:
            line = self.addRelativePath(line)
            clean = False

        if ":::" in line :
            line = self.insertAlert(line)
            clean = False

        if "${varVersion}" in line :
            line = line.replace("${varVersion}", "{{page.version}}")
            clean = False

        if "<!--{:" in line or "<!-- {:" in line:
            clean = False

            if line[0] == "*" :
                split1 = line.split('{:')
                line = "* {:"+split1[1].split('}')[0]+"}"+split1[0].split('<!--')[0][1:]+"\n"
            else :        
                line = line.replace("<!--{:",'{:')
                line = line.replace("}-->",'}')
                line = line.replace("<!-- {:",'{:')
                line = line.replace("} -->",'}')

            # print "res : "+line
        self.content += line 

        if clean :
             self.full_text_content += self.cleanLine(line)

    def image_management(self,line):
        split_line = line.split("](")
        print line
        nw_line = split_line[0]
        lenSplitLine = len(split_line)
        for i in range(1,lenSplitLine):
            split_line_2 = split_line[i].split(")")
            img_uri = split_line_2[0]
            nw_line += "]("+img_uri+"){:.img-responsive}"
            lenSplit2 = len(split_line_2)
            if(lenSplit2 > 1 ):
                for i in (1,len(split_line_2)-1):
                    nw_line += split_line_2[i]
            if "\"" in img_uri : img_uri = img_uri.split(" \"")[0]
            # print "insert images ... "
            self.insertImg(img_uri)
        
        return nw_line

    
    
    def insertImg(self,img_uri):
        img_path = self.path+'/'
        path_tab = img_uri.split('/')

        img_basename = path_tab.pop()

        img_path+="/".join(path_tab)

        if not os.path.exists(img_path):
            # print f.path +  " doesn't exist"
            os.makedirs(img_path)

        # print "Start copying %s in %s" % (self.old_path+img_uri,img_path+"/"+img_basename)
        try :
            copyfile(self.old_path+img_uri,img_path+"/"+img_basename)
        except IOError :
            print "%s not found" % self.old_path+img_uri
        # print "Transfert successful"
   
    
    def addRelativePath(self,line):
        
        res = ""
        split1 = line.split("](")

        nbLinks = len(split1)

        res += split1[0]

        for i in range(1,nbLinks):

            after =""

            if "#" in split1[i] :
                split2 = split1[i].split('#')
                after+="#"
            elif "://" in split1[i]:
                res += "]("+split1[i]
                continue
            else :
                split2 = split1[i].split(")")
                after += ")"
            
            
            after += ')'.join(split2[1:])
            basename = split2[0]

            # print "[ "+self.base_name + "]\n" + line
            
            try : 
               
                path = JekyllMdFile.getPath(basename)
                if not path :
                    print line
                    path = ""
                res += "]({{\""+ path +basename.split(".md")[0]+"\" | relative_url}}"+after

            except Exception :
                

                res = res.split('[')[0] + res.split('[')[1] + ')'.join(after.split(')')[1:])

            
        # print res
        return res

    def insertAlert(self,line):

        # print self.base_name
        split1 = line.split(":::")
        level=""

        if len(split1) >= 2 :
            level = split1[1]

        level = level.replace(" ","")
        level = level.replace("\n","")
        
        # print level
        return "{% endalert %}\n" if not level else "{%% alert %s %%}\n" % level 

    def injectParts(self):
        if len(self.parts) > 0 :
            split1 = self.content.split("## "+self.parts[0]['title'])
           
            # print split1[1]
            self.content = split1[0] + self.getParts() + "## "+self.parts[0]['title']+"\n"+split1[1]
        
    def getParts(self):
        lg = '<div class="list-group">'

        for part in self.parts :
            lg+='<a href="{{"'+ JekyllMdFile.getPath(self.base_name)+self.base_name.strip('.md') +'" | relative_url}}'+'#'+slugify(part['title']) +'" class="list-group-item toc-h2">'+part['title']+'</a>'

            for sub in part['h3']:
                lg+='<a href="{{"'+ JekyllMdFile.getPath(self.base_name)+self.base_name.strip('.md') +'" | relative_url}}'+'#'+slugify(sub) +'" class="list-group-item toc-h3">'+sub+'</a>'
    
        lg += '\n</div>'

        return lg

    def addH2(self,part):
        h2 = {
            'title' : part,
            'h3' : []
        }

        self.parts.append(h2)

    def addH3(self,part):
        if len(self.parts) > 0:
            self.parts[-1]['h3'].append(part)

    def indexingContent(self):
        excerpt_limit = 100
        categories=""
        if self.categs :
            categories = '"'+"\",\"".join(self.categs)+"\""
        now = str(datetime.datetime.now())
        print now
        slug = self.base_name.replace(".md","")
        url = "/"+JekyllMdFile.getPath(self.base_name)+"/"+slug
        content = self.cleanLine(self.full_text_content.replace("'",""))
        res = """ {
            "draft": false,
            "categories": [ 
                %s
            ],
            "layout": "doc",
            "title": "%s",
            "order": %s,
            "slug": "%s",
            "ext": ".md",
            "tags": [],
            "excerpt": "%s",
            "date": "%s",
            "url": "%s",
            "text": "%s"
            }""" % (categories,self.title, str(self.order), slug, content[0:excerpt_limit],now, url,content)
        return res
   
    def cleanLine(self, line):
        cleaned_line = line.replace("#","").replace("*","").replace("</div>","").replace(":","").replace("{","").replace("}","").replace('\\','').replace('"','\\"').replace("\n","").replace("\r","")
        for s in string.whitespace:
            cleaned_line = cleaned_line.replace(s, " ")
        return cleaned_line