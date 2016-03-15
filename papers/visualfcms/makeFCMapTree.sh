makeFCMapTree ()
{
  # Define the colouring for FC Mapping and VDisk states
  idle_or_copied=green
  preparing=yellow
  prepared=green
  copying=green
  stopped=red
  suspended=red
  stopping=yellow
  online=green
  offline=red
  degraded=yellow
  
  # Start the directed graph
  echo "digraph F {";
  srcs=($1);
  processed=();
  while [ ${#srcs[@]} -gt 0 ]; do
    currSrc=${srcs[0]};
    srcs=(${srcs[@]:1});
    svcinfo lsvdisk -nohdr -filtervalue id=$currSrc | while read id name \
iogId iogName vStatus junk; do
      vdkColour=$(eval echo \$$vStatus);
      echo "$currSrc [style=filled,fillcolor=$vdkColour]";
    done
    newTgts=(`svcinfo lsfcmap -nohdr -filtervalue source_vdisk_id=$currSrc \
-delim :| while IFS=: read id n srcId srcName tgtId tgtName gId gName \
status junk; do echo "$id $tgtId $status"; done`);
    processed[$currSrc]=y;
    for ((i=0; i<${#newTgts[@]};i=$(($i + 3)))); do
      fcm=${newTgts[$i]};
      tgt=${newTgts[$(($i + 1))]};
      status=${newTgts[$(($i + 2))]};
      colour=$(eval echo \$$status);
      echo "fc$fcm [label=\"$fcm\"shape=box,height=0.4,width=0.4,\
fillcolor=$colour,style=filled]";
      echo "$currSrc -> fc$fcm";
      echo "fc$fcm -> $tgt";
      if [ "${processed[$tgt]}" != "y" ]; then
      srcs=(${srcs[@]} $tgt);
      fi;
      svcinfo lsfcmapdependentmaps -nohdr $fcm | while read fcId fcName; do
        echo "$fcm -> $fcId [style=dotted]"
      done
    done;
    
    newSrcs=(`svcinfo lsfcmap -nohdr -filtervalue target_vdisk_id=$currSrc| \
while read id name srcId junk; do echo "$srcId "; done`);
    for src in ${newSrcs[@]};
    do
      if [ "${processed[$src]}" != "y" ]; then
      srcs=(${srcs[@]} $src);
      fi;
    done;
  done;
  echo "}";
}