/*!
 * @file rachel_template.js
 * @brief a template engine which is used in web front end.
 * @author colinZhang
 * @date 2018/10/06
 * @version 2.0.0
 * @function 1.{`objKey`},2.{`firstObjKey.secondObjKey`},3.{`if_obj`},4.{`!if_obj`},5.{`for_obj`}
 */

class rachel_template{
    /*
   html_obj is just like "<div><p>{`name`}</p></div>"
   value_obj is like {name:"andy",fruits:[{fruit:apple},{fruit:banana}]}
   ѭ��ģ��--{`for_()`},�ж�ģ��--{`if_()`},{`!if_()`},����ģ��{`()`},{`().()`}
   */

    /*
    ��ģ�����Ҫ�����ǣ�����������ʽ��search�������ֶ��и��ַ������ֶ���װԪ��
    */
    render_template(html_obj,value_obj){

        while(html_obj.search('`}')>=0){

            let back_block=html_obj.search('`}')
            let font_block=html_obj.substring(0,back_block).search('{`')+2
            //ͨ��html_obj.substring(font_block,back_block)���Եõ��ؼ��ַ���
            let key_string=html_obj.substring(font_block,back_block)

            if(key_string.indexOf('!if')>=0){
                html_obj=this.handle_not_if(html_obj,value_obj,font_block,back_block)
            }

            else if(key_string.indexOf('if')>=0){
                html_obj=this.handle_if(html_obj,value_obj,font_block,back_block)
            }

            else if(key_string.indexOf('for')>=0){
                html_obj=this.handle_for(html_obj,value_obj,font_block,back_block)
            }

            else if(key_string.indexOf('.')>=0){

                let font_dict_name=key_string.substring(0,key_string.indexOf('.'))
                let back_dict_name=key_string.substring(key_string.indexOf('.')+1)
                html_obj=html_obj.substring(0,font_block-2)+value_obj[font_dict_name][back_dict_name]+html_obj.substring(back_block+2)
            }

            else {
                html_obj=html_obj.substring(0,font_block-2)+value_obj[key_string]+html_obj.substring(back_block+2)
            }

        }
        return html_obj

    }

    handle_for(html_obj,value_obj,font_block,back_block){
        //font_block��Ϊ�˵õ�key_value
        font_block+=4
        let key_string=html_obj.substring(font_block,back_block)
        console.log(key_string)
        let key_value=value_obj[key_string]
        let added_string=""
        let last_string=html_obj.substring(back_block+2)
        let last_close_dot=last_string.search('{`for`}')
        let return_string=last_string.substring(0,last_close_dot)
        //Ĭ��key_valueΪ����
        for(let i=0;i<key_value.length;i+=1){
            let now_dict=key_value[i]
            let answer_string=this.render_template(return_string,now_dict)
            added_string+=answer_string
        }
        return html_obj.substring(0,font_block-6)+added_string+last_string.substring(last_close_dot+7)
    }

    handle_if(html_obj,value_obj,font_block,back_block){
        font_block+=3
        let key_string=html_obj.substring(font_block,back_block)
        let key_value=value_obj[key_string]
        let added_string=""
        let last_string=html_obj.substring(back_block+2)
        let last_close_dot=last_string.search('{`if`}')
        let return_string=last_string.substring(0,last_close_dot)
        if(key_value!==[] && key_value!==null && key_value!==""){
            //��Ϊ��--ִ��
            added_string=this.render_template(return_string,value_obj[key_string])
        }
        return html_obj.substring(0,font_block-5)+added_string+last_string.substring(last_close_dot+6)

    }

    //˼��---ÿһ��handle�����Ĺؼ����и�����װ!
    handle_not_if(html_obj,value_obj,font_block,back_block){
        //�÷�����˼��Ϊ��!����ִ��
        font_block=font_block+4
        let key_string=html_obj.substring(font_block,back_block)
        let key_value=value_obj[key_string]
        let added_string=""
        let last_string=html_obj.substring(back_block+2)
        let last_close_dot=last_string.search('{`!if`}')
        let return_string=last_string.substring(0,last_close_dot)
        if(key_value===[] || key_value===null || key_value===""){
            //Ϊ��--ִ��
            added_string=this.render_template(return_string,value_obj[key_string])
        }
        return html_obj.substring(0,font_block-6)+added_string+last_string.substring(last_close_dot+7)
    }
}

let rachel=new rachel_template()