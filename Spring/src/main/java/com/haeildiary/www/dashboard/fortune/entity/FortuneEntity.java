<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/fortune/entity/FortuneEntity.java
package com.haeildiary.www.dashboard.fortune.entity;
========
package com.haeildairy.www.dashboard.fortune.entity;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/fortune/entity/FortuneEntity.java

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "fortune_cookie")
public class FortuneEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cookie_id")
    private Integer cookieId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
}
