HOST='ftp.brainsporthero.com'
USER='brainspo'
PASSWD='hirn42sport'

SUBDOMAINDIR='puzzles_bsh'

## ncftp ftp://brainspo:hirn42sport@ftp.brainsporthero.com/puzzles_bsh

echo export class Version {public static readonly lang = \'"en"\'\; public static readonly number = \'"$(date +%Y-%m-%d+%R:%S)"\'\;} > ../src/version.ts

cd /Users/hsp/projects/brainsport/dev/workscape/uikit

## Build Project
ng build --optimization
npx scully

## Delete old version
cd /Users/hsp/projects/brainsport/dev/workscape/uikit/ops/
ncftp ftp://$USER:$PASSWD@$HOST/$SUBDOMAINDIR < cmd.txt

## Add project specific part in index.html
cd /Users/hsp/projects/brainsport/dev/workscape/uikit/dist/static

sed  '/<!-- START -->/,/<!-- END -->/d' index.html > index2.html
cp index2.html index.html
rm index2.html

## Change language in html header
sed -i'' -e 's/lang="de"/lang="en"/g' index.html

## Add Analytics Script after marker: <!--Pointer...
sed -i'' -e '/\<\!--Pointer/r /Users/hsp/projects/brainsport/dev/workscape/uikit/ops/assets/Analytics_BrainSportHero.txt' index.html

## Upload application
wput −−timestamping * ftp://$USER:$PASSWD@$HOST/$SUBDOMAINDIR/

## upload static files
cd /Users/hsp/projects/brainsport/dev/workscape/uikit/ops/assets/brainsporthero/
wput −−timestamping * ftp://$USER:$PASSWD@$HOST/$SUBDOMAINDIR/

exit
