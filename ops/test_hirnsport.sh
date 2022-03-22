HOST='hirnsport.de'
USER='hirnsport'
PASSWD='hirn42sport'

SUBDOMAIN=denksport

echo export class Version { public static readonly lang = \'"de"\'\; public static readonly number = \'"$(date +%Y-%m-%d+%R:%S)"\'\;} > ../src/version.ts

cd /Users/hsp/projects/brainsport/dev/workscape/uikit

## Build Project
ng build --optimization
npx scully

## Delete old version
cd /Users/hsp/projects/brainsport/dev/workscape/uikit/ops/
ncftp ftp://hirnsport:hirn42sport@hirnsport.de/www/$SUBDOMAIN < cmd.txt

## update base path
cd /Users/hsp/projects/brainsport/dev/workscape/uikit/dist/static
## sed -i'' -e 's/href="\/"/href="https:\/\/denksport\.hirnsport\.de\/"/g' index.html

## Cut Local Block
sed  '/<!-- START -->/,/<!-- END -->/d' index.html > index2.html
cp index2.html index.html
rm index2.html

## Add Analytics Script after marker: <!--Pointer...
sed -i'' -e '/\<\!--Pointer/r /Users/hsp/projects/brainsport/dev/workscape/uikit/ops/assets/Analytics_HirnSport.txt' index.html

## Upload
wput −−timestamping * ftp://$USER:$PASSWD@$HOST/www/$SUBDOMAIN/

## upload static files
cd /Users/hsp/projects/brainsport/dev/workscape/uikit/ops/assets/hirnsport/
wput −−timestamping * ftp://$USER:$PASSWD@$HOST/www/$SUBDOMAIN/

exit
