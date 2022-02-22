HOST='ftp.brainsporthero.com'
USER='brainspo'
PASSWD='hirn42sport'


echo export class Version {public static readonly number = \'"$(date +%Y-%m-%d+%R:%S)"\'\;} > ../src/version.ts

##cd ..

##cd www

##rm -rf /Users/hsp/projects/brainsport/dev/ionic4/ionic-bsh-app/ionic-bsh-app/www/mix/

##cd ..

##ng build --prod  --service-worker --baseHref=/mix/ --outputPath=/Users/hsp/projects/brainsport/dev/ionic4/ionic-bsh-app/ionic-bsh-app/www/mix/ --deleteOutputPath=true

##wget http://brainsporthero.com/app/copymix.php

cd /Users/hsp/projects/brainsport/dev/workscape/uikit/dist/static

## replace href="/" with href="https://brainsporthero.com/test/static/"
sed -i'' -e 's/href="\/"/href="https:\/\/brainsporthero\.com\/test\/static\/"/g' index.html

wput −−timestamping * ftp://$USER:$PASSWD@$HOST/public_html/test/static/

exit
