%%dotdigraphapply{    rankdir = BT;    fontname = Helvetica    node[peripheries = 0, style = filled, fillcolor = blue, fontcolor = white, fontname = Helvetica, fixedsize = true, width = 1.8, height = 0.8]    edge[fontname = Helvetica, fontsize = 12, fontcolor = blue, labeldistance = 1.8]    subgraph    cluster_student    {        label = 'Student';        style = filled;        fillcolor = grey92        submit [shape = record, style = 'filled,rounded', label = 'Submit\nRegistration\n']        letter [shape = box, peripheries = 0, label = 'Letter']    }    subgraph    cluster_admin    {        label = 'Admin'        style = filled;        fillcolor = grey92        complete  [shape = diamond, height = 1.5, label = 'Application\nComplete?']        admreject [shape = record, label = 'Write Rejection\nLetter\n']    }    subgraph    cluster_registrar    {        label = 'Registrar'        style = filled;        fillcolor = grey92        min [shape = diamond, height = 1.8, label = 'Minimum\nStandard\nMet?']    }    subgraph    cluster_faculty    {        label = 'Faculty'        style = filled;        fillcolor = grey92        {            rank = same;            suitable  [shape = diamond, height = 1.8, label = 'Suitable for\nProgram?\n']            facaccept [shape = record, label = 'Write Acceptance\nLetter\n']        }    }    submit -> complete    complete -> submit     [headlabel = 'no']    complete -> min        [headlabel = 'yes']    min -> admreject       [headlabel = 'no']    min -> suitable        [headlabel = 'yes']    suitable -> admreject  [headlabel = 'no']    suitable -> facaccept  [headlabel = 'yes']    admreject -> letter    facaccept -> letter}